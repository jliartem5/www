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
App::uses('ElementHelper', 'View/Helper');

class NotesController extends AppController {

    public $uses = array('User', 'Notes', 'NoteElement', 'NoteDefaultConfig');
    public $components = array('Utility');

    public function beforeFilter() {
        parent::beforeFilter();
        if ($this->Auth->loggedIn() == false) {
            return $this->redirect('/pages/index');
        }
    }

    public function index() {
        $note_list = $this->Notes->find('all', array('conditions' => array(
                'user_id' => $this->Auth->user()['id']
        )));
        $this->set('notes', $note_list);
    }

    public function write() {
        $completeUser = $this->User->findById($this->Auth->user()['id']);
        $this->set('DefaultConfig', $completeUser['note_default_config']);
    }

    public function save() {
        if ($this->request->is('post')) {
            $this->Notes->create();
            $note_data = array(
                'Note' => array('user_id' => $this->Auth->user()['id'])
            );
            $ds = $this->Notes->getdatasource();
            $note_saved = $this->Notes->save($note_data['Note']);
            if ($note_saved) {
                $front_data = array();
                $back_data = array();
                $merged_data = array();
                //construire les élements à inserer dans la base de donnée
                foreach ($this->request->data['notes'] as $decriptedID => $value) {
                    if (substr($decriptedID, 0, 2) == '__') {//si c'est les données cachés pour les configurations d'element
                        $decriptedID = substr($decriptedID, 2);
                        $back_data[$decriptedID] = json_decode(ElementHelper::descriptData($value), true);
                    } else {
                        $front_data[$decriptedID] = $value;
                    }
                }
                //fusionner les données front et back pour inserer dans la bdd
                $insertID = $this->Notes->getInsertID();
                foreach ($front_data as $id => $val) {
                    $back_data[$id]['value'] = $val;
                    $back_data[$id]['note_id'] = $insertID;
                    $merged_data[] = $back_data[$id];
                }

                $element_saved = $this->NoteElement->saveMany($merged_data);
                if ($element_saved) {
                    $this->Session->setFlash('Note saved');
                }
            } else {
                $this->Session->setFlash('Note not saved');
            }
        }
    }

    public function delete() {
        if ($this->request->is('post')) {
            $id = $this->request->data['note_id'];
            $result = $this->Notes->delete($id);
        }
    }

    public function view($key) {
        $key = UtilityComponent::descriptData($key);

        $all_notes = $this->Auth->user()['Notes'];
        if (key_exists($key, $all_notes)) {
            $note_complete = $this->Note->find('all', array(
                'conditions' => array('id' => $key)));
            $this->set('note', $note_complete);
        }
    }

    public function template_edit() {
        if ($this->request->is('post')) {
            $this->autoRender = false;//on desactive la fonctionnalité View
             
            $user_id = $this->Auth->user()['id'];
            $clear = $this->NoteDefaultConfig->delete(array('constraints' => array('user_id' => $user_id)));
            if ($clear) {
                $template_configs = array();
                foreach ($this->request->data as $id=>$element_config) {
                    unset($element_config['id']);
                    $element_config['user_id'] = $user_id;
                    $template_configs[] = $element_config;
                }
                $saveResult = $this->NoteDefaultConfig->saveMany($template_configs);
                if($saveResult){
                    return 'Template saved';
                }
            }
        } else {
            $default_template_element = $this->Auth->user()['NoteDefaultConifg'];
            $this->set('elements', $default_template_element);
        }
    }

    public function element($type, $mode) {
        $this->layout = 'ajax';
        if (strlen($type) > 0) {
            $helper = new ElementHelper(new View());
            $html = $helper->generateNewElement($type, $mode);
            $this->set('html', $html);
        }
    }

}
