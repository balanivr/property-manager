import { firebaseConfig } from '../config';
import { USER_TYPES, DATABASE_REFS, STATUS_TYPES, ACTIVE_STATES, REGIONS, BUILDINGORCOMMUNITY } from '../globals';
import isEmpty from 'lodash/isEmpty';

// GLOBAL VARS - SINGLETON CLASS
let firebase = null;
let firestore = null;
let auth = null;

const init = (_firebase) => {
    firebase = _firebase;
    firestore = _firebase.firestore();
    auth = _firebase.auth();
};

const validateFirebaseUser = (user, type) => {
    let PATH = '';
    if(type === USER_TYPES.ADMIN) {
        PATH = DATABASE_REFS.admin;
    } else if(type === USER_TYPES.AGENT) {
        PATH = DATABASE_REFS.agent;
    } else {
        return Promise.reject('Invalid user type');
    }

    return firestore.doc(`/${PATH}/${user.uid}`).get().then(snapshot => {
        if(snapshot.exists) {
            const data = {
                ...snapshot.data(),
                type
            };

            if(type === USER_TYPES.ADMIN || data.status === ACTIVE_STATES.ACTIVE) {
                // Add record of last login
                return Promise.resolve({
                    ...data,
                    id: user.uid
                });
            } else {
                return Promise.reject('User is inactive');
            }
        }
        return Promise.reject('User data not found');
    });
};

const createNewUser = (email, password) => {
  return fetch(`https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=${firebaseConfig.apiKey}`, {
      method: 'POST',
      body: JSON.stringify({
          email, password
      }),
      headers: {
          'Content-Type': 'application/json'
      }
  }).then(response => response.json());
};

// Users actions
const createUser = (user) => {
    const { password, region, name, email, userType } = user;
    return createNewUser(email, password).then(newUser => {
        const userId = newUser['localId'];
        if(isEmpty(userId)) {
            return Promise.reject('Failed to create user account');
        }
        const userDoc = {
            region, name, email, userType, status: ACTIVE_STATES.ACTIVE
        };
        if (userType.indexOf("Team Member") !== -1){
            firestore.collection('agents').doc(userId).set(userDoc);
        }
        if (userType.indexOf("Admin") !== -1){
            firestore.collection('admin').doc(userId).set(userDoc);
        }
    });
};

const updateUser = (user) => {
    const { id, region, name, email, userType, status } = user;
    const userDoc = {
        region, name, email, status, userType
    };
    if (userType.indexOf("Team Member") !== -1) {
        firestore.collection('agents').doc(id).update(userDoc);
    }
    if (userType.indexOf("Admin") !== -1) {
        firestore.collection('admin').doc(id).update(userDoc);
    }
};
const lastLoginTime = (uid,lastLoginTime,collectionName) => {
    return firestore.collection(collectionName).doc(uid).update({ lastLoginTime: lastLoginTime}).then(() => {
        return Promise.resolve(uid);
    });
};

const getAllAgents = () => {
    return firestore.collection('/agents').get().then(agents => {
        const fetchedAgents = [];
        agents.docs.forEach(doc => {
            fetchedAgents.push({
                ...doc.data(),
                id: doc.id
            });
        });

        return Promise.resolve(fetchedAgents);
    });
};

const getAgentById = (id) => {
    return firestore.doc(`/agents/${id}`).get().then(agent => {
        return Promise.resolve({
            ...agent.data(),
            id: agent.id
        });
    });
};

const updateAgentStatus = (agentId, status) => {
    console.log('Updating status', agentId, status);
    return firestore.doc(`/agents/${agentId}`).update({
        status
    });
};

// Owner actions
const getOwnerById = (ownerId, region=REGIONS.uae.value) => {
    return firestore.doc(`/regions/${region}/owners/${ownerId}`).get().then((owner) => {
        return Promise.resolve({
            ...owner.data(),
            id: owner.id
        })
    });
};

const uploadImage = (path,image) => {
    return new Promise(function (resolve, reject) {
        const fileName = Date.now()+"_"+image.name;
        const storageRef = firebase.storage().ref(path + fileName);
        const uploadTask = storageRef.put(image);

        uploadTask.on('state_changed', function (snapshot) {
            console.log('Upload is running');
        }, function (error) {
            console.log(error)
        },
            function () {
                uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                    console.log('File available at', downloadURL);
                    resolve(downloadURL);
                });
            });
    });
}

const createOwner = (owner, user, status, region=REGIONS.uae.value) => {
    const { prefix, name, emails, nationality, phoneNumbers, addresses, attachments } = owner;
    status = status ? status : STATUS_TYPES.DRAFT;
    const ownerDoc = {
        prefix,
        name,
        emails,
        nationality,
        phoneNumbers,
        addresses,
        region,
        status,
        attachments,
        agent: {
            id: auth.currentUser.uid,
            name: user.name
        }
    };
    return firestore.collection(`/regions/${region}/owners`).add(ownerDoc).then((ref) => {
        return Promise.resolve({
            ...owner,
            id: ref.id
        })
    });
};

const updateOwner = (owner, user, status, region=REGIONS.uae.value) => {
    const { id, prefix, name, emails, nationality, phoneNumbers, addresses, attachments } = owner;
    status = status ? status : owner.status;

    if(id === null) {
        return Promise.reject('Owner Id not provided');
    }

    const ownerDoc = {
        prefix, name, emails, nationality, phoneNumbers, addresses, status, attachments
    };

    return firestore.collection(`/regions/${region}/owners`).doc(id).update(ownerDoc).then(() => {
        return Promise.resolve(owner);
    });
};

const getAllOwners = (status, region=REGIONS.uae.value) => {
    let query = firestore.collection(`/regions/${region}/owners`);
    query = status ? query.where('status', '==', status) : query;

    return query
        .get().then(owners => {
        const fetchedOwners = owners.docs.map(doc => {
            return {
                ...doc.data(),
                id: doc.id
            };
        });
        return Promise.resolve(fetchedOwners);
    });
};

const getOwnersOfAgent = (agentId, status=false, region=REGIONS.uae.value) => {
    let query = firestore.collection(`/regions/${region}/owners`).where('agent.id', '==', agentId);
    query = status ? query.where('status', '==', status) : query;

    return query
        .get().then(agents => {
        let owners = agents.docs.map(doc => {
            return {
                ...doc.data(),
                id: doc.id
            };
        });
        owners = owners.filter(owner => owner.status !== STATUS_TYPES.DELETED);
        return Promise.resolve(owners);
    });
};

const updateOwnerStatus = (ownerId, status, region=REGIONS.uae.value) => {
    console.log('Updating status', ownerId, status);
    return firestore.doc(`/regions/${region}/owners/${ownerId}`).update({
        status
    });
};

const updateOwnerProperties = (ownerId, properties, region=REGIONS.uae.value) => {
    console.log('Updating status', ownerId, properties);
    return firestore.doc(`/regions/${region}/owners/${ownerId}`).update({
        ...properties
    });
};

// Representative actions
const createRepresentative = (representative, user, status, region=REGIONS.uae.value) => {
    const { prefix, name, emails, nationality, phoneNumbers, addresses, owner,attachments } = representative;
    status = status ? status : STATUS_TYPES.DRAFT;

    const representativeDoc = {
        prefix,
        name,
        emails,
        nationality,
        phoneNumbers,
        addresses,
        region,
        status,
        owner,
        attachments,
        agent: {
            id: auth.currentUser.uid,
            name: user.name
        }
    };

    return firestore.collection(`/regions/${region}/representatives`).add(representativeDoc).then((ref) => {
        return Promise.resolve({
            ...representative,
            id: ref.id
        })
    });
};

const updateRepresentative = (representative, status, region=REGIONS.uae.value) => {
    const { id, prefix, name, emails, nationality, phoneNumbers, addresses, owner, agent,attachments } = representative;
    status = status ? status : representative.status;

    if(id === null) {
        return Promise.reject('Representative Id not provided');
    }

    const representativeDoc = {
        prefix, name, emails, nationality, phoneNumbers, addresses, owner, agent, status, attachments
    };

    return firestore.collection(`/regions/${region}/representatives`).doc(id).update(representativeDoc).then(() => {
        return Promise.resolve(representative);
    });
};

const getAllRepresentatives = (status, region=REGIONS.uae.value) => {
    let query = firestore.collection(`/regions/${region}/representatives`);
    query = status ? query.where('status', '==', status) : query;

    return query
        .get().then(representatives => {
        let fetchedRepresentatives = representatives.docs.map(doc => {
            return {
                ...doc.data(),
                id: doc.id
            };
        });
        fetchedRepresentatives = fetchedRepresentatives.filter(representative => representative.status !== STATUS_TYPES.DELETED);
        return Promise.resolve(fetchedRepresentatives);
    });
};

const getRepresentativesOfOwner = (ownerId, region=REGIONS.uae.value) => {
    return firestore.collection(`/regions/${region}/representatives`)
        .where('owner', '==', ownerId)
        .get().then(representativeRefs => {
            let representatives = representativeRefs.docs.map(doc => {
                return {
                    ...doc.data(),
                    id: doc.id
                };
            });
            representatives = representatives.filter(representative => representative.status !== STATUS_TYPES.DELETED);
            return Promise.resolve(representatives);
        });
};

const getRepresentativesOfAgent = (agentId, status=false, region=REGIONS.uae.value) => {
    let query = firestore.collection(`/regions/${region}/representatives`).where('agent.id', '==', agentId);
    query = status ? query.where('status', '==', status) : query;

    return query
        .get().then(representativeRefs => {
            let representatives = representativeRefs.docs.map(doc => {
                return {
                    ...doc.data(),
                    id: doc.id
                };
            });
            representatives = representatives.filter(representative => representative.status !== STATUS_TYPES.DELETED);
            return Promise.resolve(representatives);
        });
};

const getRepresentativeById = (representativeId, region=REGIONS.uae.value) => {
    return firestore.doc(`/regions/${region}/representatives/${representativeId}`).get().then(representative => {
        return Promise.resolve({
            ...representative.data(),
            id: representative.id
        });
    });
};

const updateRepresentativeStatus = (representativeId, status, region=REGIONS.uae.value) => {
    console.log('Updating status', representativeId, status);
    return firestore.doc(`/regions/${region}/representatives/${representativeId}`).update({
        status
    });
};

const updateRepresentativeProperties = (representativeId, properties, region=REGIONS.uae.value) => {
    console.log('Updating status', representativeId, properties);
    return firestore.doc(`/regions/${region}/representatives/${representativeId}`).update({
        ...properties
    });
};

const getAllProperties = (status=false, region=REGIONS.uae.value) => {
    console.log('Fetching properties');
    let query = firestore.collection(`/regions/${region}/properties`);
    query = status ? query.where('status', '==', status) : query;

    // return firestore.collection(`/regions/${region}/properties`).get().then(properties => {
    return query.get().then(properties => {
        return Promise.resolve(properties.docs.map(propertyDoc => {
            return {
                ...propertyDoc.data(),
                id: propertyDoc.id
            }
        }));
    });
};

const getPropertiesOfAgent = (agentId, status=false, region=REGIONS.uae.value) => {
    let query = firestore.collection(`/regions/${region}/properties`).where('agent.id', '==', agentId);
    query = status ? query.where('status', '==', status) : query;

    return query
        .get().then(propertyRefs => {
            let properties = propertyRefs.docs.map(doc => {
                return {
                    ...doc.data(),
                    id: doc.id
                };
            });
            properties = properties.filter(property => property.status !== STATUS_TYPES.DELETED);
            return Promise.resolve(properties);
        });
};

const createProperty = (property, owner, representative, user, status, region=REGIONS.uae.value) => {
    const {
        usage,
        type,
        details,
        amenities,
        attachments,
        geocode
    } = property;

    const propertyDoc = {
            usage,
            type,
            details,
            owner,
            representative,
            attachments,
            amenities,
            geocode,
            status: status ? status : STATUS_TYPES.DRAFT,
            agent: {
                id: auth.currentUser.uid,
                name: user.name
            }
    };

    return firestore.collection(`/regions/${region}/properties`).add(propertyDoc).then(ref => {
        return Promise.resolve({
            ...propertyDoc,
            id: ref.id
        });
    });
};

const updateProperty = (property, owner, representative, status, region=REGIONS.uae.value) => {
    const {
        id,
        usage,
        type,
        details,
        amenities,
        attachments,
        agent,
        geocode,
    } = property;

    const propertyDoc = {
        usage,
        type,
        owner,
        representative,
        details,
        amenities,
        attachments,
        status,
        agent,
        geocode
    };

    return firestore.doc(`/regions/${region}/properties/${id}`).set(propertyDoc).then(() => {
        return Promise.resolve(property);
    });
};

const updatePropertyStatus = (propertyId, status, region=REGIONS.uae.value) => {
    return firestore.doc(`/regions/${region}/representatives/${propertyId}`).update({
        status
    });
};

const updatePropertyProperties = (propertyId, properties, region=REGIONS.uae.value) => {
    console.log('Updating status', propertyId, properties);
    return firestore.doc(`/regions/${region}/properties/${propertyId}`).update({
        ...properties
    });
};

const createbusinessOrCommunity = (businessOrCommunity, user, status, region = REGIONS.uae.value) => {
    const { name, property_id, address, attachments, usage, type, amenities, community, geocode } = businessOrCommunity;
    status = status ? status : STATUS_TYPES.DRAFT;
    const businessOrCommunityDoc = {
        name,
        property_id,
        address,
        region,
        status,
        amenities,
        attachments,
        usage,
        type,
        geocode,
        agent: {
            id: auth.currentUser.uid,
            name: user.name
        }
    };
    if(community){
        businessOrCommunityDoc.community = community;
    }

    return firestore.collection(`/regions/${region}/buildingCommunity`).add(businessOrCommunityDoc).then((ref) => {
        return Promise.resolve({
            ...businessOrCommunity,
            id: ref.id
        });
    });
};
const getBuildingCommunityOfAgent = (agentId, status = false, region = REGIONS.uae.value) => {
    let query = firestore.collection(`/regions/${region}/buildingCommunity`).where('agent.id', '==', agentId);
    query = status ? query.where('status', '==', status) : query;

    return query
        .get().then(communityRefs => {
            let communities = communityRefs.docs.map(doc => {
                return {
                    ...doc.data(),
                    id: doc.id
                };
            });
            communities = communities.filter(community => community.status !== STATUS_TYPES.DELETED);
            return Promise.resolve(communities);
        });
};
const getBuildingOrCommunity = (status, region = REGIONS.uae.value) => {
    console.log("status",status)
    let query = firestore.collection(`/regions/${region}/buildingCommunity`);
    if(status !== ""){
        query = status ? query.where('status', '==', status) : query;
    }

    return query
        .get().then(buildings => {
            let fetchedBuildings = buildings.docs.map(doc => {
                return {
                    ...doc.data(),
                    id: doc.id
                };
            });
            fetchedBuildings = fetchedBuildings.filter(building => building.status !== STATUS_TYPES.DELETED);
            return Promise.resolve(fetchedBuildings);
        });
};

const getAllCommunities = (status, region = REGIONS.uae.value) => {
    let query = firestore.collection(`/regions/${region}/buildingCommunity`);
    query =  query.where('type', '==', "Community");

    return query
        .get().then(communities => {
            let fetchedcommunities = communities.docs.map(doc => {
                return {
                    ...doc.data(),
                    id: doc.id
                };
            });
            fetchedcommunities = fetchedcommunities.filter(community => community.status !== STATUS_TYPES.DELETED);
            return Promise.resolve(fetchedcommunities);
        });
};

const updatebusinessOrCommunity = (businessOrCommunity, user, status, region = REGIONS.uae.value) => {
    const { id, name, property_id, address, attachments, usage, type, amenities, community, geocode } = businessOrCommunity;
    status = status ? status : STATUS_TYPES.DRAFT;
    if(id === null){
        return Promise.reject('Building/Community id not provided');
    }
    const businessOrCommunityDoc = {
        name,
        property_id,
        address,
        region,
        status,
        amenities,
        attachments,
        usage,
        type,
        geocode,
        agent: {
            id: auth.currentUser.uid,
            name: user.name
        }
    };
    if (community) {
        businessOrCommunityDoc.community = community;
    }

    return firestore.collection(`/regions/${region}/buildingCommunity`).doc(id).update(businessOrCommunityDoc).then(() => {
        return Promise.resolve(businessOrCommunityDoc);
    });
};
const updateBuildingCommunity = (id, buildingProperties, region = REGIONS.uae.value) => {
    console.log('Updating status', id, buildingProperties);
    return firestore.doc(`/regions/${region}/buildingCommunity/${id}`).update({
        ...buildingProperties
    });
};
const updateBuildingCommunityStatus = (id, status, region = REGIONS.uae.value) => {
    console.log('Updating status', id, status);
    return firestore.doc(`/regions/${region}/buildingCommunity/${id}`).update({
        status
    });
};



export default {
    init,
    validateFirebaseUser,
    getAgents: getAllAgents,
    createUser,
    updateUser,
    updateAgentStatus,

    getOwnerById,
    createOwner,
    uploadImage,
    updateOwner,
    getOwnersOfAgent,
    getAllOwners,
    updateOwnerStatus,
    updateOwnerProperties,

    createRepresentative,
    updateRepresentative,
    getAllRepresentatives,
    getRepresentativesOfOwner,
    getRepresentativesOfAgent,
    getRepresentativeById,
    updateRepresentativeStatus,
    updateRepresentativeProperties,

    getAllProperties,
    getPropertiesOfAgent,
    createProperty,
    updateProperty,
    updatePropertyStatus,
    updatePropertyProperties,
    lastLoginTime,
    createbusinessOrCommunity,
    getBuildingCommunityOfAgent,
    getBuildingOrCommunity,
    getAllCommunities,
    updatebusinessOrCommunity,
    updateBuildingCommunity,
    updateBuildingCommunityStatus
};