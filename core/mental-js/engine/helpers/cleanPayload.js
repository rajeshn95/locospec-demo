var uuid = require("uuid");
const { resolveByDot } = require("./utils");
const pickKeysFromObject = requireUtil("pickKeysFromObject");

const cleanPayload = async (context) => {
  const { mentalAction, resourceModels, mentalConfig } = context;

  const resourceSpec = resourceModels[mentalAction.resource];
  const attributes = resourceSpec.attributes;

  let payload = mentalAction.payload;
  let action = mentalAction.action;
  let forIndex = 0;

  let directColumns = attributes
    .filter((c) => {
      return !c.relation && !c.mutateFrom;
    })
    .map((c) => {
      return `${c.identifier}`;
    });

  // console.log("directColumns", directColumns);

  let belongsToOneColumns = attributes
    .filter((c) => {
      return c.relation && c.relation.type === "belongs_to_one";
    })
    .map((c) => {
      return `${c.relation.resolveTo || c.identifier}`;
    });

  let belongsToOneMappings = attributes
    .filter((c) => {
      return c.relation && c.relation.type === "belongs_to_one";
    })
    .reduce(
      (obj, c) =>
        Object.assign(obj, {
          [`${c.relation.resolveTo || c.identifier}`]: c,
        }),
      {}
    );

  let hasOneColumns = attributes
    .filter((c) => {
      return c.relation && c.relation.type === "has_one";
    })
    .map((c) => {
      return `${c.relation.resolveTo || c.identifier}`;
    });

  let hasOneMappings = attributes
    .filter((c) => {
      return c.relation && c.relation.type === "has_one";
    })
    .reduce(
      (obj, c) =>
        Object.assign(obj, {
          [`${c.relation.resolveTo || c.identifier}`]: c,
        }),
      {}
    );

  let hasManyColumns = attributes
    .filter((c) => {
      return c.relation && c.relation.type === "has_many";
    })
    .map((c) => {
      return `${c.relation.resolveTo || c.identifier}`;
    });

  let hasManyMappings = attributes
    .filter((c) => {
      return c.relation && c.relation.type === "has_many";
    })
    .reduce(
      (obj, c) =>
        Object.assign(obj, {
          [`${c.relation.resolveTo || c.identifier}`]: c,
        }),
      {}
    );

  // console.log("before cleaning", attributes, hasOneColumns);

  let otherKeys = [];

  if (mentalAction.action === "read") {
    otherKeys = ["limitBy", "sortBy", "filterBy"];
  }

  payload = pickKeysFromObject(payload, [
    ...directColumns,
    ...belongsToOneColumns,
    ...otherKeys,
  ]);

  mentalAction["payload"] = payload;
  mentalAction["directColumns"] = directColumns;
  mentalAction["belongsToOneColumns"] = belongsToOneColumns;
  mentalAction["belongsToOneMappings"] = belongsToOneMappings;
  mentalAction["hasOneColumns"] = hasOneColumns;
  mentalAction["hasOneMappings"] = hasOneMappings;
  mentalAction["hasManyColumns"] = hasManyColumns;
  mentalAction["hasManyMappings"] = hasManyMappings;

  mentalAction["primaryColumns"] = resourceSpec.primary;
  context.mentalAction = mentalAction;

  return context;
};

module.exports = cleanPayload;
