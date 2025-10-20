import { Routes, Route, Navigate } from "react-router-dom";

import { useAuth } from "../hooks/auth";

import { Home } from "../pages/Home";
import { Users } from "../pages/Users";
import { Domains } from "../pages/Domains";
import { Details } from "../pages/Details";
import { NewPublication } from "../pages/NewPublication";
import { EditPublication } from "../pages/EditPublication";
import { PublicationTypes } from "../pages/PublicationTypes";
import { Backup } from "../pages/Backup";

export function LoggRoutes() {
    const { user } = useAuth();

    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/users" element={<Users />} />
            <Route path="/publication/:id" element={<Details />} />
            <Route path="/edit-publication/:id" element={<EditPublication />} />
            <Route path="/create-publication" element={<NewPublication />} />

            {user.role === "admin" && <Route path="/domains" element={<Domains />} />}
            {user.role === "admin" && <Route path="/publication-types" element={<PublicationTypes />} />}
            {user.role === "admin" && <Route path="/backup" element={<Backup />} />}
            
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
}