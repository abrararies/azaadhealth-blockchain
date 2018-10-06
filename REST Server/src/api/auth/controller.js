import { sign } from "../../services/jwt";
import { success } from "../../services/response/";

export const login = ({ user }, res, next) => {
  return sign(user.id)
    .then(token => {
      return { token, user: user.view(true) };
    })
    .then(success(res, 201))
    .catch(next);
};
