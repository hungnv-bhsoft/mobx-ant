import React from 'react';
import axios from 'axios';
import { useLocalStore } from 'mobx-react';

export const ProjectContext = React.createContext();

const ProjectStore = ({ children }) => {
    const store = useLocalStore(() => ({
        projects : [],
        async fetchProjects() {
            const res = await axios.get('http://localhost:3004/projects');
            return this.projects.push(res.data);
        },
        async createProject(obj) {
            const res = await axios.post('http://localhost:3004/projects',obj);
            console.log(res.data);
        },
        async deleteProject(id) {
            const res = await axios.delete(`http://localhost:3004/projects/${id}`);
            console.log(res.data);
        },
        async editProject(id,obj) {
            const res = await axios.put(`http://localhost:3004/projects/${id}`,obj);
            console.log(res.data);
        },
        get listProject() {
            return store.projects;
        }
    }));

    return (
        <ProjectContext.Provider value={store}>
            {children}
        </ProjectContext.Provider>
    )
}

export default ProjectStore;
