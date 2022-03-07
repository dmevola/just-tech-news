const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const bcrypt = require('bcrypt');

//create user model
class User extends Model {
    checkPassword(loginPw) {
        return bcrypt.compareSync(loginPw, this.password);
      }
}

//define table columns and configuration

User.init(
    {
        // define an id column
        id: {
            //use the special sequlize DataTypes object provide what type of data it is
            type: DataTypes.INTEGER,
            //this is = to SQLs NOT NULL
            allowNull: false,
            //instruct that this is primary key
            primaryKey: true,
            //turn on auto increment
            autoIncrement: true
        },
        //define a username column
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        
            // define an 
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        //define a password column
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [4]
            }
        }
        },
    {
        hooks: {
            //set up beforeCreate lifecycle 'hook' functionality
           async beforeCreate(newUserData) {
                newUserData.password = await bcrypt.hash(newUserData.password, 10);
                return newUserData;
            },
            async beforeUpdate(updatedUserData) {
                updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
                return updatedUserData;
            }
        },
        //table column options go here

        //pass in our imported sequelize connection (the direct connect to db)
        sequelize,
        // don't automatically create createAt/updatedAt timestamp fields
        timestamps: false,
        // don't pluralize name of database table
        freezeTableName: true,
        // user underscores instead of camel-casing
        underscored: true,
        //make it so our model name stays lowercase in the db
        modelName: 'user'
    }
);

module.exports = User;