import React from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { Button } from 'antd';

const DetailWrap = styled.div`
    width: 1100px;
    margin: 0 auto;
    text-align: center;
`;

const CardImg = styled.img`
    /* display: block; */
    width:  400px;
    height: 400px;
    object-fit: cover;
`;
export default () => {
    const history = useHistory();
    const [projects,setProjects] = React.useState([]);
    React.useEffect(() => {
        getProjects();

    },[]);

    const getProjects = async () => {
        const res = await axios.get('http://localhost:3004/projects');
        setProjects(res.data);
    }
    let {Id} = useParams();
    let detail = projects.filter( pro => pro.id == Id)[0];
    // console.log(detail);
    return (
    <div>
        {detail !== undefined && (
            <DetailWrap>
                <h3>{detail.title}</h3>
                <CardImg src={require(`./../../../assets/imgs/${detail.image}`)} alt={detail.image} />
                <p>{detail.content}</p>
                <Button type="primary" onClick={ () => history.push('/projects') } >Back</Button>
            </DetailWrap>
        )}

    </div>
    )
};