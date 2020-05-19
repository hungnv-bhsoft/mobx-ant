import { useLocalStore } from 'mobx-react';

const test = useLocalStore(() => ({
    name : 'Hung',
    replaceName (name){
        return this.name = name
    }
}));

export default test;