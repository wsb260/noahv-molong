/**
 * Created by noahv-cli.
 */

/* eslint-disable  no-undef */
import Vue from 'vue';
import { destroyVM } from '../util';
import testForm from 'src/test/form'

describe('testForm', () => {
    let vm;
    afterEach(() => {
        destroyVM(vm);
    });

    // visit http://www.chaijs.com/api/ for more detail for insertion
    it('has a data hook', () => {
        expect(typeof testForm.data).to.equal('function');
    });

    it('new instance', () => {
        vm = new Vue(tableDemo).$mount();
        // expect()
    });

    // your expect
});
/* eslint-enable 
