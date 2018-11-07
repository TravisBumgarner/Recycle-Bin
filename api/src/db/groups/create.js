import knex from "../knex"

const create = exercise_id => {
    return knex("groups")
        .insert({ exercise_id })
        .returning("exercise_id")
}

export default create
