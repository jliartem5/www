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

        $this->Auth->allow('save', 'allNotes');
        /* if ($this->Auth->loggedIn() == false) {
          return $this->redirect('/pages/index');
          } */
    }

    public function index() {
        
    }

    public function allNotes() {
        $this->autoRender = false;
        $note_list = $this->Notes->find('threaded', array('conditions' => array(
                'user_id' => $this->Auth->user()['id']),
            'fields' => array('id', 'create_date', 'last_modif_date', 'symbol'),
            'recursive' => 0));
        return json_encode($note_list);
    }

    /**
     * Note data to save:
     * {
     * Note:{},
     * NoteElements:[{},...]
     * }
     * 
     * */
    //{"data":{ "Note": {"id":"c083f241-57ea-4eb1-6b57-5f41e57ace0d", "symbol":"LC"}, "NoteElements": [] }, "user":{"User":{"id":"6"}}}
    public function save() {
        $this->autoRender = false;
        $result = array();
        $data = json_decode($this->request->data, true);
        debug($data);
        if ($this->request->is('post')) {
            try {
                $this->Notes->create();
                $note_data = array(
                    'Note' => $data['data']['Note']
                );
                $note_data['Note']['user_id'] = $data['user']['User']['id'];

                $isNewNote = UtilityComponent::isGUID($note_data['Note']['id']);
                $nodeID = $note_data['Note']['id'];
                if ($isNewNote) {
                    unset($note_data['Note']['id']);
                } else {
                    $note_data['Note']['id'] = UtilityComponent::descriptData($note_data['Note']['id']);
                }

                $dataSource = $this->Notes->getDataSource();

                $dataSource->begin();
                $note_saved = $this->Notes->save($note_data['Note']);
                if ($note_saved) {

                    //construire les élements à inserer dans la base de donnée
                    $insertID = $this->Notes->getInsertID();
                    $result['sync'] = array();

                    if ($isNewNote) {
                        $result['sync']['Note'] = array("from" => $nodeID, 'to' => $insertID);
                    }
                    $result['sync']['NoteElements'] = array();
                    foreach ($data['data']['NoteElements'] as $element) {
                        $isNewElement = UtilityComponent::isGUID($element['id']);
                        $element['note_id'] = $insertID;
                        $savedElementID = $element['id'];
                        if ($isNewElement) {
                            unset($element['id']);
                        } else {
                            $element['id'] = UtilityComponent::descriptData($element['id']);
                        }

                        $element_saved = $this->NoteElement->save($element);

                        if ($isNewElement) {

                            $result['sync']['NoteElements'][] = array('from' => $savedElementID, 'to' => $this->NoteElement->getInsertID());
                        }
                        if ($element_saved == false) {
                            throw new Exception('Canoot save note element');
                        }
                    }
                    $result['result'] = "success";
                } else {
                    throw new Exception('Cannot save note');
                }
            } catch (Exception $e) {
                $dataSource->rollback();
                return json_encode(array('result' => 'failed', 'error' => $e->getMessage()));
            }
        } else {
            $result['result'] = 'failed';
        }
        $dataSource->commit();
        return json_encode($result);
    }

    public function delete() {
        if ($this->request->is('post')) {
            $id = $data['note_id'];
            $result = $this->Notes->delete($id);
        }
    }

    public function template_edit() {
        if ($this->request->is('post')) {
            $this->autoRender = false; //on desactive la fonctionnalité View

            $user_id = $this->Auth->user()['id'];
            $clear = $this->NoteDefaultConfig->deleteAll(array('user_id' => $user_id), true);

            if ($clear) {
                $template_configs = array();
                foreach ($data as $id => $element_data) {
                    unset($element_data['id']);
                    $config = json_decode(ElementHelper::descriptData($element_data['config']), true);
                    $config['position'] = json_encode($element_data['position'], true);
                    $config['label'] = $element_data['label'];
                    $config['value'] = $element_data['value'];
                    $config['user_id'] = $user_id;

                    $template_configs[] = $config;
                }

                $saveResult = $this->NoteDefaultConfig->saveMany($template_configs);
                if ($saveResult) {
                    return 'Template saved';
                }
            } else {
                return 'Cannot clear old templat';
            }
        } else {
            $default_template_element = $this->NoteDefaultConfig->find('all', array('conditions' => array(
                    'user_id' => $this->Auth->user()['id']
            )));
            $this->set('elements', $default_template_element);
        }
    }

    //generer un element et retourner code html
    public function element($type, $mode) {
        $this->autoRender = false;
        if (strlen($type) > 0) {
            $helper = new ElementHelper(new View());
            return $helper->generateNewElement($type, $mode);
        }
    }

    //recuperer default template + code htmls
    public function templateConfig() {
        $this->autoRender = false;
        $completeUser = $this->User->findById($this->Auth->user()['id']);
        $result = array();

        $result['templateConfig'] = $completeUser['note_default_config'];

        $templateTypes = array();
        foreach ($completeUser['note_default_config'] as $config) {
            if (in_array($config['type'], $templateTypes) == false) {
                $templateTypes[] = $config['type'];
            }
        }
        $result['elementTemplate'] = $this->_elements($templateTypes, 'edit');

        return json_encode($result);
    }

    //get all elemnts of geven note ID
    public function noteElements($key) {
        $this->autoRender = false;
        $key = UtilityComponent::descriptData($key);

        $note_complete = $this->NoteElement->find('threaded', array(
            'conditions' => array('note_id' => $key),
            'fields' => array('id', 'label', 'type', 'value', 'position', 'create_date'),
            'recursive' => 0));
        return json_encode($note_complete);
    }

    public function _elements(array $type, $mode) {
        $helper = new ElementHelper(new View());
        $result = array();
        foreach ($type as $name) {
            $result[$name] = $helper->generateNewElement($name, $mode);
        }
        return $result;
    }

}
