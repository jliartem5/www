<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of UtilityComponent
 *
 * @author jian
 */
class UtilityComponent extends Component{
    public function DateTimeNow(){
        return (new DateTime())->format('Y-m-d H:i:s');
    }
}
