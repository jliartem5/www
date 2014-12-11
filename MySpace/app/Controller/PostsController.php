<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of PostsController
 *
 * @author jian
 */
class PostsController extends AppController {

    public $helpers = array('Html', 'Form');

    public function index() {
        $this->set('posts', $this->Post->find('all'));
    }

    public function view($id = null) {
        $post = $this->Post->findById($id);
        $this->set('post', $post);
    }

    public function add() {
        if ($this->request->is("post")) {
            $this->Post->create();
            
            if ($this->Post->save($this->request->data)) {
                $this->Session->setFlash(__("Your post has been saved."));
                return $this->redirect(array("action" => "index"));
            }
            $this->Session->setFlash(__("Unable to add your post."));
        }
    }

    public function edit($id = null) {
        if (!$id) {
            throw new NotFoundException(__("Invalid post"));
        }
        $post = $this->Post->findById($id);
        if (!$post) {
            throw new NotFoundException(__("Invalid post"));
        }
        if ($this->request->is(array("post", "put"))) {
            $this->Post->id = $id;
            if ($this->Post->save($this->request->data)) {
                $this->Session->setFlash(__("Your post has been updated."));
                return $this->redirect(array("action" => "index"));
            }
            $this->Session->setFlash(__("Unable to update your post."));
        }
        if (!$this->request->data) {
            $this->request->data = $post;
        }
    }

    public function delete($id) {
        if ($this->request->is("get")) {
            throw new MethodNotAllowedException();
        }
        if ($this->Post->delete($id)) {
            $this->Session->setFlash(
                    __("Le post avec id : %s a été supprimé.", h($id))
            );
            return $this->redirect(array("action" => "index"));
        }
    }

}
