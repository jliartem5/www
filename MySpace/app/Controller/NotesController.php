<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of NotesController
 *
 * @author jian
 */
class NotesController extends AppController {

    public $uses = array('User', 'Notes');

    public function beforeFilter() {
        parent::beforeFilter();
        if ($this->Auth->loggedIn() == false) {
            return $this->redirect('/pages/index');
        }
    }

    public function index() {
        
    }

    public function write() {
        $completeUser = $this->User->findById($this->Auth->user()['id']);
        $this->set('DefaultConfig', $completeUser['note_default_config']);
    }

    public function save() {
        if ($this->request->is('post')) {
            $this->Notes->create();
            $note_saved = $this->Notes->save(array(
                'user_id' => $this->Auth->user()['id']
            ));
            if ($note_saved) {
                debug($this->request->data);
                $this->Session->setFlash('Note saved');
            }
        }
    }

    public function delete() {
        
    }

}
