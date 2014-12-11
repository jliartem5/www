<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of User
 *
 * @author jian
 */
class User extends AppModel {
    public $name = 'User';
    public $hasOne = array(
        'config' => array(
            'className' => 'UserConfig'
        ),
        'note_default_config' => array(
            'className' => 'NoteDefaultConfig'
        )
    );
    
    public $validate = array(
        'email'=>array(
            'rule'=>'email',
            'message'=>'An email is required'
        ),
        'password'=>array(
            'rule'=>array('minLength','4'),
            'message'=>'4 caracter minimum',
           
        )
    );
    
    public function beforeSave($options = array()) {
        if (!empty($this->data[$this->alias]['password'])) {
            $passwordHasher = new SimplePasswordHasher(array('hashType' => 'sha256'));
            $this->data[$this->alias]['password'] = $passwordHasher->hash(
                $this->data[$this->alias]['password']
            );
        }
        return true;
    }
    
}
