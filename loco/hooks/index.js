function beforeHandleCreateUsers(context) {
  const { locoAction } = context;
  console.log("before!", locoAction["payload"]);
  locoAction["payload"].name = "ron";
  console.log("after", locoAction["payload"]);
  console.log("context", context);
  return context;
}

// <before/after> <prepare/validate/Handle> <Create/read/patch> <resource/Users>,
module.exports = {
  beforeHandleCreateUsers,
};
