<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of AnnotationsController
 *
 * @author jian
 */

class AnnotationsController extends AppController {
    public $uses = array('User', 'Notes', 'Annotations', 'AnnotationReply');
    public $components = array('Utility');

    public function get($symbol){
        $this->autoRender = false;
        $anns = $this->Annotations->find('threaded', array('conditions' => array(
                'symbol' => $symbol),
            'recursive' => 0));
        return json_encode($anns);
    }
    
    public function getReply($ann){
        $this->autoRender = false;
        $replys = $this->AnnotationReplys->find('threaded', array('conditions' => array(
                'annotation_id' => $ann),
            'recursive' => 0));
        return json_encode($replys);
    }
    
    /**
     * Request data structure:
     *  {
         
         
        }
     * 
     * 
     * */
    public function create(){
        if($this->request->is('post')){
            
        }
    }
    
    public function reply(){
        if($this->request->is('post')){
            
        }
    }
}