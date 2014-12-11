<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of UserController
 *
 * @author jian
 */
App::uses('SimplePasswordHasher', 'Controller/Component/Auth');

class UsersController extends AppController {

    var $uses = array('NoteDefaultConfig', 'User');
    var $components = array('Notes');

    public function beforeFilter() {
        parent::beforeFilter();
        // Permet aux utilisateurs de s'enregistrer et de se déconnecter
        $this->Auth->allow('register', 'login');
    }
    
    public function login() {
        if ($this->request->is('post')) {
            
            if ($this->Auth->login()) {
                return $this->redirect($this->Auth->redirectUrl());
            } else {
                $this->Session->setFlash('Compte ou mot de passe incorrect:'.$this->Auth->login());
            }
        }
        return $this->redirect(array('controller' => 'pages', 'action' => 'index'));
    }

    public function logout() {
        return $this->redirect($this->Auth->logout());
    }

    public function register() {
        $error = "-";
        if ($this->request->is('post')) {
            $this->User->create();

            if (count($this->User->findByEmail($this->request->data['User']['email'])) == 0) {
                $now = new DateTime();
                $this->request->data['User']['create_date'] = $now->format('Y-m-d H:i:s');
                if ($this->User->save($this->request->data)) {
                    $this->Session->setFlash('User registred');
                } else {
                    $error = "Impossible de s'inscrire:" . print_r($this->User->validationErrors, true);
                }
            } else {
                $error = 'User ' . $this->request->data['User']['email'] . ' already exists';
            }
        }
        $this->Session->setFlash($error);
       // return $this->redirect(array('controller' => 'pages', 'action' => 'index'));
    }

    public function profil() {
        
    }

}
