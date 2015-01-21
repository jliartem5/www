<form action="http://localhost/MySpace/notes/save" method="post">
    Data:
    <input type="text" name="data" value="">
    <input type="submit" value="Submit">
</form>

<pre class="cake-error"><a href="javascript:void(0);" onclick="document.getElementById('cakeErr54bb0d2280243-trace').style.display = (document.getElementById('cakeErr54bb0d2280243-trace').style.display == 'none' ? '' : 'none');"><b>Notice</b> (8)</a>: Undefined index: position [<b>APP/Model/NoteElement.php</b>, line <b>96</b>]<div id="cakeErr54bb0d2280243-trace" class="cake-stack-trace" style="display: none;"><a href="javascript:void(0);" onclick="document.getElementById('cakeErr54bb0d2280243-code').style.display = (document.getElementById('cakeErr54bb0d2280243-code').style.display == 'none' ? '' : 'none')">Code</a> <a href="javascript:void(0);" onclick="document.getElementById('cakeErr54bb0d2280243-context').style.display = (document.getElementById('cakeErr54bb0d2280243-context').style.display == 'none' ? '' : 'none')">Context</a><pre id="cakeErr54bb0d2280243-code" class="cake-code-dump" style="display: none;"><code><span style="color: #000000"><span style="color: #0000BB"></span></span></code>
<code><span style="color: #000000"><span style="color: #0000BB">&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color: #007700">public&nbsp;function&nbsp;</span><span style="color: #0000BB">beforeSave</span><span style="color: #007700">(</span><span style="color: #0000BB">$options&nbsp;</span><span style="color: #007700">=&nbsp;array())&nbsp;{</span></span></code>
<span class="code-highlight"><code><span style="color: #000000"><span style="color: #0000BB">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color: #007700">if(</span><span style="color: #0000BB">is_array</span><span style="color: #007700">(</span><span style="color: #0000BB">$this</span><span style="color: #007700">-&gt;</span><span style="color: #0000BB">data</span><span style="color: #007700">[</span><span style="color: #DD0000">'NoteElement'</span><span style="color: #007700">][</span><span style="color: #DD0000">'position'</span><span style="color: #007700">])){</span></span></code></span></pre><pre id="cakeErr54bb0d2280243-context" class="cake-context" style="display: none;">$options = array(
	&#039;validate&#039; =&gt; true,
	&#039;fieldList&#039; =&gt; array(),
	&#039;callbacks&#039; =&gt; true,
	&#039;counterCache&#039; =&gt; true
)</pre><pre class="stack-trace">NoteElement::beforeSave() - APP/Model/NoteElement.php, line 96
CakeEventManager::dispatch() - CORE/Cake/Event/CakeEventManager.php, line 240
Model::save() - CORE/Cake/Model/Model.php, line 1788
NotesController::save() - APP/Controller/NotesController.php, line 98
ReflectionMethod::invokeArgs() - [internal], line ??
Controller::invokeAction() - CORE/Cake/Controller/Controller.php, line 490
Dispatcher::_invoke() - CORE/Cake/Routing/Dispatcher.php, line 191
Dispatcher::dispatch() - CORE/Cake/Routing/Dispatcher.php, line 165
[main] - APP/webroot/index.php, line 108</pre></div></pre><pre class="cake-error"><a href="javascript:void(0);" onclick="document.getElementById('cakeErr54bb0d2281e34-trace').style.display = (document.getElementById('cakeErr54bb0d2281e34-trace').style.display == 'none' ? '' : 'none');"><b>Notice</b> (8)</a>: Undefined index: position [<b>APP/Model/NoteElement.php</b>, line <b>96</b>]<div id="cakeErr54bb0d2281e34-trace" class="cake-stack-trace" style="display: none;"><a href="javascript:void(0);" onclick="document.getElementById('cakeErr54bb0d2281e34-code').style.display = (document.getElementById('cakeErr54bb0d2281e34-code').style.display == 'none' ? '' : 'none')">Code</a> <a href="javascript:void(0);" onclick="document.getElementById('cakeErr54bb0d2281e34-context').style.display = (document.getElementById('cakeErr54bb0d2281e34-context').style.display == 'none' ? '' : 'none')">Context</a><pre id="cakeErr54bb0d2281e34-code" class="cake-code-dump" style="display: none;"><code><span style="color: #000000"><span style="color: #0000BB"></span></span></code>
<code><span style="color: #000000"><span style="color: #0000BB">&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color: #007700">public&nbsp;function&nbsp;</span><span style="color: #0000BB">beforeSave</span><span style="color: #007700">(</span><span style="color: #0000BB">$options&nbsp;</span><span style="color: #007700">=&nbsp;array())&nbsp;{</span></span></code>
<span class="code-highlight"><code><span style="color: #000000"><span style="color: #0000BB">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color: #007700">if(</span><span style="color: #0000BB">is_array</span><span style="color: #007700">(</span><span style="color: #0000BB">$this</span><span style="color: #007700">-&gt;</span><span style="color: #0000BB">data</span><span style="color: #007700">[</span><span style="color: #DD0000">'NoteElement'</span><span style="color: #007700">][</span><span style="color: #DD0000">'position'</span><span style="color: #007700">])){</span></span></code></span></pre><pre id="cakeErr54bb0d2281e34-context" class="cake-context" style="display: none;">$options = array(
	&#039;validate&#039; =&gt; true,
	&#039;fieldList&#039; =&gt; array(),
	&#039;callbacks&#039; =&gt; true,
	&#039;counterCache&#039; =&gt; true
)</pre><pre class="stack-trace">NoteElement::beforeSave() - APP/Model/NoteElement.php, line 96
CakeEventManager::dispatch() - CORE/Cake/Event/CakeEventManager.php, line 240
Model::save() - CORE/Cake/Model/Model.php, line 1788
NotesController::save() - APP/Controller/NotesController.php, line 98
ReflectionMethod::invokeArgs() - [internal], line ??
Controller::invokeAction() - CORE/Cake/Controller/Controller.php, line 490
Dispatcher::_invoke() - CORE/Cake/Routing/Dispatcher.php, line 191
Dispatcher::dispatch() - CORE/Cake/Routing/Dispatcher.php, line 165
[main] - APP/webroot/index.php, line 108</pre></div></pre>