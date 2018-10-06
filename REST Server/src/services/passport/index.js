import passport from "passport";
import { Schema } from "bodymen";
import { BasicStrategy } from "passport-http";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as BearerStrategy } from "passport-http-bearer";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { jwtSecret, masterKey } from "../../config";
import User, { schema } from "../../api/user/model";

export const password = () => (req, res, next) => {
  return passport.authenticate(
    "password",
    { session: false },
    (err, user, info) => {
      if (err && err.param) {
        return res.status(400).json(err);
      } else if (err || !user) {
        return res.status(401).end();
      }
      req.logIn(user, { session: false }, err => {
        if (err) return res.status(401).end();
        next();
      });
    }
  )(req, res, next);
};

export const master = () => {
  return passport.authenticate("master", { session: false })
};

export const token = ({ required, roles = User.roles } = {}) => (
  req,
  res,
  next
) =>
  passport.authenticate("token", { session: false }, (err, user, info) => {
    if (
      err ||
      (required && !user) ||
      (required && !~roles.indexOf(user.role))
    ) {
      return res.status(401).end();
    }
    req.logIn(user, { session: false }, err => {
      if (err) return res.status(401).end();
      next();
    });
  })(req, res, next);

passport.use(
  "password",
  new BasicStrategy((email, password, done) => {
    const userSchema = new Schema({
      email: schema.tree.email,
      password: schema.tree.password
    });

    userSchema.validate({ email, password }, err => {
      if (err) done(err);
    });

    User.findOne({ email }).then(user => {
      if (!user) {
        done(true);
        return null;
      }
      return user
        .authenticate(password, user.password)
        .then(user => {
          done(null, user);
          return null;
        })
        .catch(done);
    });
  })
);

export const passwordWithLocalStrat = () => (req, res, next) => {
  return passport.authenticate(
    "local",
    { session: false },
    (err, user, info) => {
      console.log("ERROR", err);
      if (err && err.param) {
        return res.status(400).json(err);
      } else if (err || !user) {
        return res.status(401).json(err);
      }
      req.logIn(user, { session: false }, err => {
        if (err) return res.status(401).end();
        next();
      });
    }
  )(req, res, next);
};
passport.use(
  "local",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password"
    },
    function(email, password, done) {
      User.findOne({ email }, function(err, user) {
        console.log("Step 02 ", user);

        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false);
        }
        user.authenticate(password).then(valid => {
          if (!valid) {
            return done(null, false);
          } else {
            return done(null, user);
          }
        });
      });
    }
  )
);
passport.use(
  "master",
  new BearerStrategy((token, done) => {
    if (token === masterKey) {
      done(null, {});
    } else {
      done(null, false);
    }
  })
);

passport.use(
  "token",
  new JwtStrategy(
    {
      secretOrKey: jwtSecret,
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromUrlQueryParameter("access_token"),
        ExtractJwt.fromBodyField("access_token"),
        ExtractJwt.fromAuthHeaderWithScheme("Bearer")
      ])
    },
    ({ id }, done) => {
      console.log("Inside ext token", id)
      User.findById(id)
        .then(user => {
          done(null, user);
          return null;
        })
        .catch(done);
    }
  )
);
