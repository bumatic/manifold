import { possessivize } from "utils/string";
import r from "./requests";

const defaultExpiration = 5000;

export default {
  [r.beProjectDestroy]: payloadIgnored => {
    return {
      level: 0,
      heading: "The project has been deleted.",
      body: `Alas, it has passed into the endless night.`,
      expiration: defaultExpiration
    };
  },
  [r.beUserUpdate]: payload => {
    return {
      level: 0,
      heading: "Success!",
      body: `${possessivize(
        payload.data.attributes.fullName
      )} account has been updated.`,
      expiration: defaultExpiration
    };
  },
  [r.gPasswordReset]: payloadIgnored => {
    return {
      level: 0,
      heading: "Success!",
      body: "Your password has been reset.",
      expiration: defaultExpiration
    };
  },
  [r.beMakerUpdate]: payload => {
    return {
      level: 0,
      heading: "Success!",
      body: `${payload.data.attributes.fullName} has been updated.`
    };
  },
  [r.beMakerCreate]: payload => {
    return {
      level: 0,
      heading: "New maker record created",
      body: `${possessivize(
        payload.data.attributes.fullName
      )} can now be added to projects, texts, and users in the backend.`,
      expiration: defaultExpiration
    };
  },
  "editor-backend-settings": payloadIgnored => {
    return {
      level: 0,
      id: "SETTINGS_UPDATED",
      heading: "Manifold settings updated",
      body: "Your Manifold settings changes have been applied.",
      expiration: defaultExpiration
    };
  },
  "update-creators": payloadIgnored => {
    return {
      level: 0,
      heading: "Project authors has been updated",
      expiration: defaultExpiration
    };
  },
  "create-creators": payload => {
    return {
      level: 0,
      heading: "New maker record created",
      body: `${possessivize(
        payload.data.attributes.fullName
      )} can now be added to projects, texts, and users in the backend.`,
      expiration: defaultExpiration
    };
  },
  "update-contributors": payloadIgnored => {
    return {
      level: 0,
      heading: "Project contributors have been updated.",
      expiration: defaultExpiration
    };
  },
  "create-contributors": payload => {
    return {
      level: 0,
      heading: "New maker record created.",
      body: `${possessivize(
        payload.data.attributes.fullName
      )} can now be added to projects, texts, and users in the backend.`,
      expiration: defaultExpiration
    };
  },
  [r.beTextCategoryDestroy]: () => {
    return {
      level: 0,
      heading: "The category has been deleted.",
      body: `To sleep, perchance to dream - ay, there's the rub`,
      expiration: defaultExpiration
    };
  },
  [r.beMakerDestroy]: () => {
    return {
      level: 0,
      heading: "The maker has been deleted.",
      body: `Henceforth I quit thee from my thought, my part is ended on thy stage.`,
      expiration: defaultExpiration
    };
  },
  [r.beUserCreate]: payload => {
    return {
      level: 0,
      heading: "New user record created",
      body: `${possessivize(
        payload.data.attributes.fullName
      )} account created.`,
      expiration: defaultExpiration
    };
  },
  [r.beUserDestroy]: () => {
    return {
      level: 0,
      heading: "The user has been deleted.",
      body: `Henceforth I quit thee from my thought, my part is ended on thy stage.`,
      expiration: defaultExpiration
    };
  },
  "editor-backend-edit-user": payload => {
    return {
      level: 0,
      heading: "Success!",
      body: `${possessivize(
        payload.data.attributes.fullName
      )} account has been updated.`,
      expiration: defaultExpiration
    };
  },
  "editor-backend-create-project": () => {
    return {
      level: 0,
      heading: "Your project has been created.",
      body: "A new manifold project is born.",
      expiration: defaultExpiration
    };
  },
  "editor-backend-project-update": payload => {
    return {
      level: 0,
      heading: "Success!",
      body: `${payload.data.attributes.title} has been updated.`,
      expiration: defaultExpiration
    };
  },
  "editor-backend-category-update": payload => {
    return {
      level: 0,
      heading: "Success!",
      body: `${payload.data.attributes.title} has been saved.`,
      expiration: defaultExpiration
    };
  },
  "editor-backend-resource-create": payloadIgnored => {
    return {
      level: 0,
      heading: "Your resource has been created.",
      body: "A new manifold resource is born.",
      expiration: defaultExpiration
    };
  },
  "editor-backend-maker-update": payload => {
    return {
      level: 0,
      heading: "Success!",
      body: `${payload.data.attributes.fullName} has been updated.`,
      expiration: defaultExpiration
    };
  },
  "editor-backend-resource-update": payload => {
    return {
      level: 0,
      heading: "Success!",
      body: `${payload.data.attributes.title} has been updated.`,
      expiration: defaultExpiration
    };
  },
  [r.beCollectionCreate]: payloadIgnored => {
    return {
      level: 0,
      heading: "Your collection has been created.",
      body: "A new manifold collection is born.",
      expiration: defaultExpiration
    };
  },
  [r.beCollectionUpdate]: payload => {
    return {
      level: 0,
      heading: "Success!",
      body: `${payload.data.attributes.title} has been updated.`,
      expiration: defaultExpiration
    };
  },
  [r.beTwitterQueryUpdate]: payloadIgnored => {
    return {
      level: 0,
      heading: "Success!",
      body: `This Twitter query has been updated.`,
      expiration: defaultExpiration
    };
  },
  [r.beTwitterQueryCreate]: payload => {
    let query = null;
    if (payload && payload.data && payload.data.attributes) {
      query = payload.data.attributes.query;
    }
    const msg = query
      ? `This project will now fetch tweets for "${query}".`
      : "The Twitter query has been created.";
    return {
      level: 0,
      heading: "Success!",
      body: msg,
      expiration: defaultExpiration
    };
  },
  [r.beTwitterQueryDestroy]: payloadIgnored => {
    return {
      level: 0,
      heading: "Success!",
      body: "The twitter query has been deleted.",
      expiration: defaultExpiration
    };
  },
  [r.beTwitterQueryFetch]: payloadIgnored => {
    return {
      level: 0,
      heading: "Success!",
      body: `Tweets have been fetched.`,
      expiration: defaultExpiration
    };
  },
  [r.bePermissionCreate]: payloadIgnored => {
    return {
      level: 0,
      heading: "Success!",
      body: `The selected permissions have been granted.`,
      expiration: defaultExpiration
    };
  },
  [r.bePermissionDestroy]: payloadIgnored => {
    return {
      level: 0,
      heading: "Success!",
      body: `The selected permissions have been revoked.`,
      expiration: defaultExpiration
    };
  },
  [r.bePermissionUpdate]: payloadIgnored => {
    return {
      level: 0,
      heading: "Success!",
      body: `The selected permissions have been updated.`,
      expiration: defaultExpiration
    };
  }
};
