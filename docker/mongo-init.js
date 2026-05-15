db = db.getSiblingDB("mydb");

db.createUser({
  user: "appuser",
  pwd: "password123",
  roles: [
    {
      role: "readWrite",
      db: "mydb",
    },
  ],
});

print("Application user created");
