import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import sequelize from "../util/database";

interface UserAttributes{
    id: number;
    email: string;
    phone:number;
    name: string;
    password: string;
}

interface UserActivationAttribute extends Optional<UserAttributes, "id">{}

class User extends Model<UserAttributes, UserActivationAttribute> implements UserAttributes{
    public id!: number;
    public email!: string;
    public phone!:number;
    public name!: string;
    public password!: string;
}

User.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
        unique:true,
     
    },
    phone:{
        type: DataTypes.INTEGER,
        allowNull:true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
},
{
    sequelize,
    tableName: "users",
    timestamps: true, 
})
   


export default User;