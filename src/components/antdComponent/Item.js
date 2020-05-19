import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { ProjectContext } from '../../stores/ProjectStore';
// import '../../assets/imgs/';
import { Modal, Button, Space } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import AntModal from './AntModal';
import AntEditForm from './AntEditForm';

const Li = styled.li`
    width: 25%;
    padding: 10px;
    border: 1px solid #fff;
    &:hover {
        border: 1px solid #ddd;
    }
`;


const CardStyle = styled.div`
    width: 100%;
    text-align: center;
    overflow: hidden;
`;

const CardImg = styled.img`
    display: block;
    width:  100%;
    height: 200px;
    object-fit: cover;
`;
const LinkStyle = styled(Link)`
    &:hover h3 {
        color : red;
    }
`;



const Item = ({id , title , image}) => {

    const store = React.useContext(ProjectContext);
    const { confirm } = Modal;

    function showConfirm() {
    confirm({
        title: 'Do you Want to delete these items?',
        icon: <ExclamationCircleOutlined />,
        content: 'Some descriptions',
        onOk() {
            store.deleteProject(id);
        },
        onCancel() {
        console.log('Cancel');
        },
    });
    }

    const [state,setState] = React.useState({
        loading : false,
        visible : false,
        success : false,
    });

    const showModal = () => {
        setState({...state, visible : true});
    };

    const handleOk = () => {
        setState({...state, loading : true});
        setTimeout(() => {
            setState({
                ...state,
                visible: false,
                loading: false,
            });
        }, 1500);
    };
    const handleCancel = () => {
        setState({
            ...state,
            visible: false,
        });
    };

    const { visible, loading } = state;

    let placeImg = !image ? require('./../../assets/imgs/placeholder-images.png') : require(`./../../assets/imgs/${image}`);
    return (
        <Li>
            <CardStyle>
            <LinkStyle to={`project/${id}`}>
                <CardImg src={placeImg} alt="image" />
                <h3>{title}</h3>
            </LinkStyle>
            <Space>
            <Button type="secondary" onClick={showModal} >
                Edit
            </Button>
            <Modal
            title="Edit Project"
            visible={visible}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={null}
            >
            <AntEditForm
            onOk={handleOk}
            loading={loading}
            pId={id}
            />
            </Modal>
            <Button type="primary" onClick={showConfirm} >
                Delete
            </Button>
            </Space>
            </CardStyle>
        </Li>
    )
}

export default Item;
