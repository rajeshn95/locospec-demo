const validator = requireValidator();
const { resolveByDot } = require("./utils");

module.exports = async (attributes, mentalAction) => {
  let payload = mentalAction.payload;
  let action = mentalAction.action;
  let forIndex = 0;
  const constraints = {};

  // required
  // within
  // regex
  // unique - select count(*) from where ....

  for (forIndex = 0; forIndex < attributes.length; forIndex++) {
    const attribute = attributes[forIndex];
    const validators = resolveByDot(`operations.${action}.validate`, attribute);
    if (validators) {
      constraints[attribute.identifier] = {};

      //   console.log("validators", validators);

      for (let vCounter = 0; vCounter < validators.length; vCounter++) {
        const validator = validators[vCounter];
        if (validator.type === "required") {
          constraints[attribute.identifier]["presence"] = {
            allowEmpty: false,
            message: `^Please enter ${attribute.label}`,
          };
        }

        if (validator.type === "regex") {
          constraints[attribute.identifier]["format"] = {
            pattern: validator.value,
            message: `^Please enter valid ${attribute.label} matching ${validator.value}`,
          };
        }

        if (validator.type === "within") {
          constraints[attribute.identifier]["inclusion"] = {
            within: validator.value,
            message: `^Please choose valid type within ${JSON.stringify(
              validator.value
            )}`,
          };
        }
      }
    }
  }

  //   console.log("constraints", constraints, payload);

  try {
    let validatorResult = await validator(payload, constraints);
  } catch (error) {
    throw error;
  }

  return mentalAction;
};
