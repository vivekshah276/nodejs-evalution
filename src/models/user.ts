import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import sequelize from "../util/database";

interface UserAttributes{
    id: number;
    email: string;
    phone:number;
    name: string;
    password: string;
    resetToken: string | null;
    resetTokenExpiration: Date | null;
}

interface UserActivationAttribute extends Optional<UserAttributes, "id">{}

class User extends Model<UserAttributes, UserActivationAttribute> implements UserAttributes{
    public id!: number;
    public email!: string;
    public phone!:number;
    public name!: string;
    public password!: string;
    public resetToken!: string |null ;
    public resetTokenExpiration!: Date | null ;
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
        allowNull: false,
        unique:true,
     
    },
    phone:{
        type: DataTypes.INTEGER,
        allowNull:false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    resetToken:{
        type:DataTypes.STRING || null,
        allowNull: true,
        defaultValue:null
    },
    resetTokenExpiration:{
        type:DataTypes.DATE || null,
        allowNull: true,
        defaultValue:null
    },
},
{
    sequelize,
    tableName: "users",
    timestamps: true, 
})
   


export default User;