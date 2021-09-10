import { required, email, min, confirmed } from "vee-validate/dist/rules";
import { extend, configure } from "vee-validate";
import i18n from "@/plugins/i18n";

configure({
  defaultMessage: (field, values) => {
    // override the field name.
    // values._field_ = i18n.t(`fields.${field}`);

    return i18n.t(`validate.${values._rule_}`, values);
  },
});

extend("required", required);

extend("email", email);

extend("min", min);

extend("confirmed", confirmed);
