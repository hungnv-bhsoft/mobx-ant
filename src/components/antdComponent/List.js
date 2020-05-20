import React from 'react';
import styled from 'styled-components';

import Item from '../antdComponent/Item';
import { ProjectContext } from '../../stores/ProjectStore';
import { toJS } from 'mobx';
import { useObserver } from 'mobx-react';

const Ul = styled.ul`
    padding: 50px 15px;
    margin: 0;
    list-style-type: none;
    display : flex;
    flex-wrap: wrap;
`;


const List = () => {

    const store = React.useContext(ProjectContext);
    const { fetchProjects } = toJS(store);
    // console.log(store);
    React.useEffect(() => {
        fetchProjects();

    },[]);



    return useObserver(() => {
        const listPro = toJS(store.listProject);
        console.log(listPro);

        return  (
            <Ul>
                {listPro !== undefined && listPro.map( project => {
                    return <Item key={project.id}  {...project} />
                })}
            </Ul>
        )
    });
}

export default List;
