var foldableEvent = {
	'click' : function(target){
		if (target.className.indexOf('fold-by-click') == -1)
		{
			return;
		}
		
		var subMenu = target.parentElement.querySelectorAll('a.sidebar-nav-item-sub');
		if (subMenu.length < 1)
		{
			return;
		}
		
		var display = subMenu[0].style.display;
		subMenu.forEach(function(elem, index){
			elem.style.display = (display != 'none')? 'none' : '';
		});
	}
};

var activeEvent = {
	'click' : function(target){
		if (!target.classList.contains('sidebar-nav-item'))
		{
			return;
		}
		
		document.querySelectorAll('a.sidebar-nav-item').forEach(function(elem,index){
			elem.classList.remove('active');
		});
		
		target.classList.add('active');
	}
};

var context = document.URL.replace(/^((http|https):\/\/[A-Za-z0-9.:]*\/)/g, '/');
document.querySelectorAll('a.sidebar-nav-item').forEach(function(elem,index){
	var href = elem.getAttribute('href');
	var categoryUrl = '/' + _page.category.toLowerCase();
	var menuUrl = _site.baseurl + _nav.Categories + '#' + _page.category.toLowerCase();
	if (context == href || (context != '/' && context.startsWith(categoryUrl) && menuUrl == href))
	{
		elem.classList.add('active');
	}
});

(function(document) {
	var toggle = document.querySelector('.sidebar-toggle');
	var sidebar = document.querySelector('#sidebar');
	var checkbox = document.querySelector('#sidebar-checkbox');

	document.addEventListener('click', function(e) {
	  var target = e.target;

	  if (target === toggle) {
		checkbox.checked = !checkbox.checked;
		e.preventDefault();
	  } else if (checkbox.checked && !sidebar.contains(target)) {
		checkbox.checked = false;
	  }
	  
	  foldableEvent.click(target);
	  activeEvent.click(target);
	}, false);
})(document);
