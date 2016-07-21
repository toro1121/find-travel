export default function(db) {
    return db.define("users", {
        id: Number,
        name: String,
        username: String
    });
};
