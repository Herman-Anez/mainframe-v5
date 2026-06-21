#!/usr/bin/env python3
import os
import re

# Directory of this script (ddd-knowledge folder)
base_dir = os.path.dirname(os.path.abspath(__file__))

# Map known acronyms to their uppercase forms for nicer titles
acronyms = {
    'cqrs': 'CQRS',
    'ddd': 'DDD',
    'orm': 'ORM',
    'api': 'API',
    'jwt': 'JWT',
    'uuid': 'UUID',
    'sse': 'SSE',
    'ux': 'UX',
    'id': 'ID',
    'db': 'DB',
    'dto': 'DTO',
    'jpa': 'JPA',
    'sql': 'SQL',
    'nosql': 'NoSQL',
    'ef': 'EF',
    'sla': 'SLA'
}

def get_title(filename):
    """
    Generates a document title from its filename.
    Removes the extension, replaces hyphens with spaces, capitalizes the first letter,
    and converts known acronyms to uppercase.
    """
    name = filename[:-3] if filename.endswith('.md') else filename
    words = name.split('-')
    title_words = []
    for i, word in enumerate(words):
        lower_word = word.lower()
        if lower_word in acronyms:
            title_words.append(acronyms[lower_word])
        elif i == 0:
            title_words.append(word.capitalize())
        else:
            title_words.append(word)
    return ' '.join(title_words)

keywords = {
    '**Nota**:': '[!NOTE]',
    '**Nota:**': '[!NOTE]',
    '*Nota*:': '[!NOTE]',
    '*Nota:*': '[!NOTE]',
    '**Importante**:': '[!IMPORTANT]',
    '**Importante:**': '[!IMPORTANT]',
    '**Buenas prácticas**:': '[!TIP]',
    '**Buenas prácticas:**': '[!TIP]',
    '**Recomendaciones**:': '[!TIP]',
    '**Recomendaciones:**': '[!TIP]',
    '**Advertencia**:': '[!WARNING]',
    '**Advertencia:**': '[!WARNING]',
    '**Cuidado**:': '[!CAUTION]',
    '**Cuidado:**': '[!CAUTION]',
}

def format_content(content, title):
    """
    Formats the content by adding a H1 title, shifting headings,
    and converting traditional alert blocks to GitHub-style alerts.
    """
    lines = content.splitlines()
    new_lines = []
    
    # Add title at the top
    new_lines.append(f"# {title}")
    new_lines.append("")
    
    in_alert = False
    alert_type = ''
    
    for line in lines:
        stripped = line.strip()
        
        # Shift headings up by 2 levels (H4->H2, H5->H3, H6->H4) for ddd-knowledge
        if line.startswith('#### '):
            line = '## ' + line[5:]
        elif line.startswith('##### '):
            line = '### ' + line[6:]
        elif line.startswith('###### '):
            line = '#### ' + line[7:]
        elif line.startswith('### '):
            # If a generic H3 header is in the text, make it H2
            line = '## ' + line[4:]
            
        # Check if we should start an alert block
        matched_kw = None
        matched_alert = None
        is_list = False
        
        for kw, alert in keywords.items():
            if stripped.startswith(kw):
                matched_kw = kw
                matched_alert = alert
                break
            elif re.match(rf'^[-*]\s+{re.escape(kw)}', stripped):
                matched_kw = kw
                matched_alert = alert
                is_list = True
                break
                
        if matched_kw:
            # Close previous alert if already in one
            if in_alert:
                in_alert = False
                new_lines.append("")
                
            in_alert = True
            alert_type = matched_alert
            
            # Start blockquote alert
            new_lines.append(f"> {alert_type}")
            
            # Clean list prefixes from the alert line if needed
            if is_list:
                cleaned_line = re.sub(rf'^[-*]\s+', '', line)
            else:
                cleaned_line = line
                
            new_lines.append(f"> {cleaned_line}")
        elif in_alert:
            # Close the alert on empty line, header, or code block start
            if stripped == '' or line.startswith('#') or line.startswith('```'):
                in_alert = False
                new_lines.append(line)
            else:
                new_lines.append(f"> {line}")
        else:
            new_lines.append(line)
            
    return '\n'.join(new_lines) + '\n'

def clean_lines(lines):
    """
    Removes leading/trailing empty lines and separator '---' lines from section blocks.
    """
    start = 0
    while start < len(lines) and lines[start].strip() == '':
        start += 1
        
    end = len(lines)
    while end > start:
        line_strip = lines[end-1].strip()
        if line_strip == '':
            end -= 1
        elif line_strip == '---':
            end -= 1
        else:
            break
            
    while end > start and lines[end-1].strip() == '':
        end -= 1
        
    return lines[start:end]

def process_aux_file(aux_path):
    """
    Parses an aux.md file, splits it into separate files, formats their content, and writes them.
    """
    print(f"\nProcessing: {aux_path}")
    with open(aux_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        
    current_file = None
    current_lines = []
    sections = {}
    
    # Matches H3 headers containing the target markdown filename (e.g. ### `entidades.md`)
    header_pattern = re.compile(r'^###\s+`?([^`\s]+\.md)`?')
    
    for line in lines:
        match = header_pattern.match(line)
        if match:
            # New section found, save the previous one if it exists
            if current_file is not None:
                sections[current_file] = clean_lines(current_lines)
            current_file = match.group(1)
            current_lines = []
        else:
            if current_file is not None:
                current_lines.append(line)
                
    if current_file is not None:
        # Save the last section
        sections[current_file] = clean_lines(current_lines)
        
    dir_path = os.path.dirname(aux_path)
    count = 0
    
    for filename, sec_lines in sections.items():
        target_path = os.path.join(dir_path, filename)
        title = get_title(filename)
        content = "".join(sec_lines)
        
        formatted = format_content(content, title)
        
        print(f"  -> Writing & Formatting: {target_path} with title '{title}'")
        with open(target_path, 'w', encoding='utf-8') as f_out:
            f_out.write(formatted)
        count += 1
        
    return count

def main():
    print("Adapted format_docs.py running on ddd-knowledge...")
    aux_files = []
    
    # Scan recursively for all aux.md files
    for root, dirs, files in os.walk(base_dir):
        if 'aux.md' in files:
            aux_files.append(os.path.join(root, 'aux.md'))
            
    total_formatted = 0
    for aux_file in sorted(aux_files):
        total_formatted += process_aux_file(aux_file)
        
    print(f"\nSuccessfully split and formatted {total_formatted} files across all directories!")

if __name__ == '__main__':
    main()
