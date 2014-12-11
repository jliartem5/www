<h1>Blog posts</h1>
<p><?php echo $this->Html->link(
"Ajouter un Post",
array("action" => "add")
); ?></p>
<table>
    <tr>
        <th>Id</th>
        <th>Titre</th>
        <th>Actions</th>
        <th>Créé le</th>
    </tr>
    <!-- Ici, nous bouclons sur le tableau $post afin d"afficher les informations des posts -->
<?php foreach ($posts as $post): ?>
    <tr>
        <td><?php echo $post["Post"]["id"]; ?></td>
        <td>
<?php echo $this->Html->link(
$post["Post"]["title"],
array("action" => "view", $post["Post"]["id"])
); ?>
        </td>
        <td>
<?php echo $this->Form->postLink(
"Supprimer",
array("action" => "delete", $post["Post"]["id"]),
array("confirm" => "Etes-vous sûr ?"));
?>
<?php echo $this->Html->link(
"Editer",
array("action" => "edit", $post["Post"]["id"])
); ?>
        </td><td>
<?php echo $post["Post"]["created"]; ?>
        </td>
    </tr>
<?php endforeach; ?>
</table>