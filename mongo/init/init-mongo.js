print("Starting init-mongo.js script");
try {
db.createUser({
  user: process.env.MONGO_USER,
  pwd:  process.env.MONGO_PASSWORD,
  roles: [
    {
      role: "readWrite",
      db: process.env.MONGO_INITDB_DATABASE,
    },
  ],
});
db = db.getSiblingDB(process.env.MONGO_INITDB_DATABASE);
db.login_token.createIndex({ "user_id": 1 }, { unique: true });
// db.login_token.createIndex(
//   { "access_token_expires_at": 1 },
//   { expireAfterSeconds: 5*60 }
// );
print("Completed init-mongo.js script");
} catch (e) {
  print("Error executing init-mongo.js:", e);
}