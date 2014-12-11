<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of ElementComponent
 * Component pour les élèments de notes
 *
 * Support Type :
 *  Text
 *  Numeric
 *  Date
 *  Hour
 *  
 *Support Option in initialize():
 *  {
 *      'note_id',
 *      'user_id'
 *  }
 * 
 * @author jian
 */
class ElementComponent extends Component{
    private $user_id = null;
    private $note_id = null;
    public function initialize($option){
        if(isset($option['user_id'])){
            $this->user_id = $option['user_id'];
        }
        if(isset($option['note_id'])){
            $this->note_id = $option['note_id'];
        }
    }
    
    public function createTextElement(){
        
    }
    public function createNumericElement(){
        
    }
    public function createDateElement(){
        
    }
}
