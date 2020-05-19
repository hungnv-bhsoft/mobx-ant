import React from 'react';
import { Form, Input, Button, Upload} from 'antd';
import { UploadOutlined } from '@ant-design/icons';


import { useObserver } from 'mobx-react';
// import { v4 as uuidv4 } from 'uuid';
import { ProjectContext } from '../../stores/ProjectStore';
import { toJS } from 'mobx';


const { TextArea } = Input;


const layout = {
    labelCol: {
        span: 4,
    },
    wrapperCol: {
        span: 20,
    },
};




const AntForm = ({ pId, onOk,loading }) => {
    // console.log(pId);

    const store = React.useContext(ProjectContext);
    const { projects } = toJS(store);
    const proDetail = projects.length > 0 && projects[0].filter( pro => pro.id == pId)[0];
    // console.log(proDetail);

    const [form] = Form.useForm();

    const [fileList,setFileList] = React.useState([]);

    React.useEffect(() => {
        form.setFieldsValue({
            title : proDetail.title,
            content : proDetail.content
        });

    },[]);

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
            store.editProject(pId,{
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

    return useObserver(() => {

        return (
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
                <UploadOutlined/> Upload
                </Button>
            </Upload>
            </Form.Item>
            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 10 }}>
                <Button loading={loading} type="primary" htmlType="submit">
                    Edit
                </Button>
            </Form.Item>
            </Form>
        )
    });
};

export default AntForm;
