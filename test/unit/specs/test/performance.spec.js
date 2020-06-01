/**
 * Created by noahv-cli.
 */

/* eslint-disable  no-undef */
import Vue from 'vue';
import { destroyVM } from '../util';
import testPerformance from 'src/test/performance'

describe('testPerformance', () => {
    let vm;
    afterEach(() => {
        destroyVM(vm);
    });

    // visit http://www.chaijs.com/api/ for more detail for insertion
    it('has a data hook', () => {
        expect(typeof testPerformance.data).to.equal('function');
    });

    it('new instance', () => {
        vm = new Vue(tableDemo).$mount();
        // expect()
    });

    // your expect
});
/* eslint-enable 
