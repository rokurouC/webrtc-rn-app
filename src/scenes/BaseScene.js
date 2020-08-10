import { Component } from 'react';
import { FirebaseRepo } from '../repo'
export class BaseScene extends Component{
    constructor(props) {
        super(props);
        this.firebaseRepo = FirebaseRepo.sharedInstance();
    }
}