//Loads all the passpots so we use the Google login
const passport = require("passport");

//Google OAuth strategy used for authentication
const GoogleStrategy = require("passport-google-oauth20").Strategy;

//User model so we can save and find the users in the database
const User = require("./server/User");

//This set up the Google login strategy
passport.use(
  new GoogleStrategy(
    {
        //Google API credentials stored in environment variables
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      
      //Where Google redirects after loging in
      callbackURL: "process.env.GOOGLE_CALLBACK_URL"
    },

    //Runs after Google sends back user information
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        //Checks if the user is already exists in the database
        if (!user) {
          user = new User({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value
          });
          await user.save();
        }

        //Finishes the login process
        return done(null, user);
      } catch (error) {
        //If something goes wrong, login fails
        return done(error, false);
      }
    }
  )
);

//Stores the user ID inside the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

//Retrieves full user data from stored ID
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, false);
  }
});