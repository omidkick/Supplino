export function highlightText(text, searchTerm) {
  if (!searchTerm || !text) return text;
  
  const regex = new RegExp(`(${searchTerm})`, 'gi');
  return text.toString().replace(regex, '<mark class="bg-yellow-300">$1</mark>');
}

export function highlightTextReact(text, searchTerm) {
  if (!searchTerm || !text) return text;
  
  const parts = text.toString().split(new RegExp(`(${searchTerm})`, 'gi'));
  return parts.map((part, index) => 
    part.toLowerCase() === searchTerm.toLowerCase() 
      ? <mark key={index} className="bg-yellow-300">{part}</mark>
      : part
  );
}