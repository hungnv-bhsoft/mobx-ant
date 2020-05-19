import React from 'react';
import { Form, Input, Button, Upload} from 'antd';
import { UploadOutlined } from '@ant-design/icons';


import { useObserver } from 'mobx-react';
import { v4 as uuidv4 } from 'uuid';
import { ProjectContext } from '../../stores/ProjectStore';


const { TextArea } = Input;


const layout = {
    labelCol: {
        span: 4,
    },
    wrapperCol: {
        span: 20,
    },
};




const AntForm = ({ onOk,loading }) => {

    const store = React.useContext(ProjectContext);

    const [form] = Form.useForm();

    const [fileList,setFileList] = React.useState([]);

    const handleChange = info => {
        let fileLists = [...info.fileList];
        //limit file
        fileLists = fileLists.slice(-1);
        //read from response and show link
        fileLists = fileLists.map( file => {
            if (file.responsive) {
                file.url = file.response.url;
            }
            return file;
        });
        setFileList(fileLists);
    }
    // if (fileList !== undefined && fileList.length > 0) {
    //     const { name } = fileList[0];
    //      console.log(name);
    // }

    const onFinish = values => {
            console.log(values);
            store.createProject({
                id : uuidv4(),
                title: values.title,
                content: values.content,
                image : values.image.file.name
            });
            form.resetFields();
            onOk(); //close modal

        };
    const onFinishFailed = errorInfo => {
            console.log('Failed:', errorInfo);
        };

        //upload
    const props = {
            action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
            onChange: handleChange,
            multiple: true,
    };

    return useObserver(() =>  (
        <Form {...layout}
        form={form}
        name="my-form"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}>
        <Form.Item label="Title" name="title" rules={[{ required : true }]} >
            <Input />
        </Form.Item>
        <Form.Item label="Content"  name="content" rules={[{ required : true }]}>
            <TextArea />
        </Form.Item>
        <Form.Item label="Image" name="image" rules={[{ required : true }]}>
        <Upload {...props} fileList={fileList}>
            <Button>
            <UploadOutlined /> Upload
            </Button>
        </Upload>
        </Form.Item>
        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 10 }}>
            <Button loading={loading} type="primary" htmlType="submit">
                Create
            </Button>
        </Form.Item>
        </Form>
    ));
};

export default AntForm;
