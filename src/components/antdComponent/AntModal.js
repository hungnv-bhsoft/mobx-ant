import React from 'react';
import {PlusOutlined} from '@ant-design/icons';
import {Modal,Button} from 'antd';
import AntForm from './AntForm';


const AntModal = () => {

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
    return (
        <div>
        <Button type="primary" onClick={showModal}>
            <PlusOutlined />
        </Button>
        <Modal
            title="Create New Project"
            visible={visible}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={null}
        >
            <AntForm
            onOk={handleOk}
            loading={loading}
            />
        </Modal>
        </div>
    )
}

export default AntModal;
