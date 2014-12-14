<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of UserConfig
 *
 * @author jian
 */
class UserConfig extends AppModel{
    
    public function genereSimpleUserConfig($user_id){
        return array(
            'last_modif_date'=> (new DateTime())->format('Y-m-d H:i:s'),
            'user_id'=>$user_id
        );
    }
}
