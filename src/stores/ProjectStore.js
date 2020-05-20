import React from 'react';
import axios from 'axios';
import { useLocalStore } from 'mobx-react';

export const ProjectContext = React.createContext();

const ProjectStore = ({ children }) => {
    const store = useLocalStore(() => ({
        projects : [],
        async fetchProjects() {
            const res = await axios.get('http://localhost:3004/projects');
            console.log('Get All project success');
            return this.projects = res.data;
        },
        async createProject(obj) {
            const res = await axios.post('http://localhost:3004/projects',obj);
            console.log(res.data);
            console.log('Create Project Sucess');
            return this.projects.push(obj);
        },
        async deleteProject(id) {
            await axios.delete(`http://localhost:3004/projects/${id}`);
            console.log('Delete project success');
            return this.projects = this.projects.filter(pro => pro.id !== id);
        },
        async editProject(id,obj) {
            const res = await axios.put(`http://localhost:3004/projects/${id}`,obj);
            console.log(res.data);
            console.log('Edit project sucess');
            const indexObj = this.projects.findIndex( pro => pro.id == id);//if true return 1;
            // console.log(this.projects[indexObj] = obj);
            return this.projects[indexObj] = obj;
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
