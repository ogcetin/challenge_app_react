import React, {useEffect, useState} from 'react';
import UserAdd from './UserAdd';
import UserEdit from './UserEdit';
import { AUTH_LIST } from '../../helpers/StaticData';
import Request from '../../helpers/Request';
import Confirmation from '../../components/Confirmation';

import { FaEdit, FaTrashAlt } from "react-icons/fa";

const userDummyData = [
    {"user_id": 1, "customer_id": 1, "name": "Saimcan", "email": "saim@can.com", "password": "123qwe", "auth": "staff" },
    {"user_id": 2, "customer_id": 1, "name": "Bekir", "email": "bekir@ozum.com", "password": "123qwe", "auth": "staff" }
]

function User(props) {
    const [showForm, setShowForm] = useState("add");
    const [userList, setUserList] = useState([]);
    const [userForEdit, setUserForEdit] = useState({});

    const [deleteID, setDeleteID] = useState(0);
    const [displayDeleteModal, setDisplayDeleteModal]= useState(false);

    useEffect(() => {
        getUserList();
    }, [props]);

    const getUserList = async () => {

        const response = await Request.Get("users");
        console.log("UserList", response);
        const edited = response.map(user => {
            const filtered = AUTH_LIST.filter(auth => auth.value == user.auth);
            user.auth_converted = filtered[0].name
            return user;
        })
        setUserList(edited);
        setShowForm("add");
    }

    const updateUserList = () => {
        getUserList();
    }

    const startEditing = (userID) => {
        let selectedUser = userList.filter((userObj) => userObj.user_id === userID);
        console.log("StartEditing", selectedUser);
        setUserForEdit(selectedUser[0])
        setShowForm("edit");
    }

    const completeEditing = () => {
        getUserList();
    }


    const responseDeleteModal = async (response) => {
        if(response){
            const response = await Request.Delete("users", deleteID);
            getUserList();
        }
        setDisplayDeleteModal(false);
    }

    return (
        <div>
            { showForm === "add" &&
                <UserAdd updateUserList={() => updateUserList()} />
            }
            {
                showForm === "edit" &&
                <UserEdit
                    data={userForEdit}
                    changeShowForm={(formName) => setShowForm(formName)}
                    completeEditing={() => completeEditing()}
                />
            }
            <div className="flex justify-center my-2 ">
                <div className="w-1/2  rounded bg-white-transparent">
                    <table className="table-auto w-full border p-2 border-collapse border-slate-600">
                        <thead>
                            <tr>
                                <th className="border border-white bg-slate-50">Müşteri ID</th>
                                <th className="border border-white bg-slate-50">Firma ID</th>
                                <th className="border border-white bg-slate-50">Müşteri Adı</th>
                                <th className="border border-white bg-slate-50">E-Posta Adresi</th>
                                <th className="border border-white bg-slate-50">Yetki</th>
                                <th className="border border-white bg-slate-50" colSpan="2">&nbsp;</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userList && userList.length > 0 &&
                                userList.map((user, index) => {
                                    return <tr key={index}>
                                        <td className="text-center border border-white py-1">{user.user_id}</td>
                                        <td className="text-center border border-white py-1">{user.customer_id}</td>
                                        <td className="text-center border border-white py-1">{user.name}</td>
                                        <td className="text-center border border-white py-1">{user.email}</td>
                                        <td className="text-center border border-white py-1">{user.auth_converted}</td>
                                        <td className="text-center border border-white py-1">
                                            <button className="text-sky-500 text-2xl"
                                                onClick={() => startEditing(user.user_id)}><FaEdit /></button>
                                        </td>
                                        <td className="text-center border border-white py-1">
                                        <button className="text-red-500 text-2xl"
                                            onClick={() => {
                                                setDeleteID(user.user_id)
                                                setDisplayDeleteModal(true);
                                            }}><FaTrashAlt /></button>
                                        </td>
                                    </tr>
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
            <Confirmation
                display={displayDeleteModal}
                changeDisplay={(val) => setDisplayDeleteModal(val)}
                type="delete"
                title=""
                response={(val)=> responseDeleteModal(val)}
            />
        </div>
    )
}

export default User;