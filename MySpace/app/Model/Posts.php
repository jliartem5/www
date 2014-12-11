<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of Posts
 *
 * @author jian
 */
class Posts extends AppModel {

    public $validate = array(
        "title" => array(
            "rule" => "notEmpty"
        ),
        "body" => array(
            "rule" => "notEmpty"
        )
    );

}
