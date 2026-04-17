const db = require('../database/connect');

class User {

    constructor({ id, first_name, last_name, email, password_hash, user_interests, job_role, meetup_preference, office_location }) {
        this.id = id;
        this.firstName = first_name;
        this.lastName = last_name;
        this.email = email;
        this.password = password_hash;
        this.userInterests = user_interests;
        this.jobRole = job_role;
        this.meetupPreference = meetup_preference;
        this.officeLocation = office_location;
    }

    static async getOneById(id) {
        const response = await db.query("SELECT * FROM users WHERE id = $1", [id]);
        if (response.rows.length != 1) {
            throw new Error("Unable to locate user.");
        }
        return new User(response.rows[0]);
    }

    static async getOneByEmail(email) {
        const response = await db.query("SELECT * FROM users WHERE email = $1", [email]);
        if (response.rows.length != 1) {
            throw new Error("Unable to locate user.");
        }
        return new User(response.rows[0]);
    }

static async create(data) {
    const { first_name, last_name, email, password, user_interests, meetup_preference, office_location } = data;

    // Insert the user (no user_interests column needed here anymore)
    const response = await db.query(
        `INSERT INTO users (first_name, last_name, email, password_hash, meetup_preference, office_location) 
         VALUES ($1, $2, $3, $4, $5, $6) 
         RETURNING id`,
        [first_name, last_name, email, password, meetup_preference, office_location]
    );

    const newId = response.rows[0].id;

    // Insert each interest into the junction table
    // user_interests comes in as an array e.g. ["Running", "Film", "Reading"]
    for (const interest of user_interests) {
        await db.query(
            `INSERT INTO user_interests (user_email, interest_name) VALUES ($1, $2)`,
            [email, interest]
        );
    }

    return await User.getOneById(newId);
}}

module.exports = User;