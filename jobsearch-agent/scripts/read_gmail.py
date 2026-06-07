#!/usr/bin/env python3
"""
Read job alert emails from Gmail via IMAP.
Outputs JSON array of normalized job objects to stdout.
Usage: python3 read_gmail.py <gmail_address> <app_password> [days_back]
"""

import imaplib
import email
import email.header
import json
import sys
import re
from datetime import datetime, timedelta

ALERT_SENDERS = [
    'jobalerts-noreply@linkedin.com',
    'alert@indeed.com',
    'noreply@wellfound.com',
    'jobs@wellfound.com',
    'noreply@greenhouse.io',
    'noreply@lever.co',
    'no-reply@glassdoor.com',
    'jobs@remotive.com',
]

def decode_header_value(value):
    if value is None:
        return ''
    parts = email.header.decode_header(value)
    result = []
    for part, charset in parts:
        if isinstance(part, bytes):
            result.append(part.decode(charset or 'utf-8', errors='replace'))
        else:
            result.append(part)
    return ''.join(result)

def extract_urls_from_text(text):
    pattern = r'https?://(?:www\.)?(?:linkedin\.com/jobs/view|indeed\.com/viewjob|wellfound\.com/jobs|greenhouse\.io/jobs|lever\.co)[^\s"<>]*'
    return re.findall(pattern, text)

def get_text_from_message(msg):
    body = ''
    if msg.is_multipart():
        for part in msg.walk():
            content_type = part.get_content_type()
            if content_type == 'text/plain':
                try:
                    body += part.get_payload(decode=True).decode('utf-8', errors='replace')
                except Exception:
                    pass
            elif content_type == 'text/html' and not body:
                try:
                    html = part.get_payload(decode=True).decode('utf-8', errors='replace')
                    body += re.sub(r'<[^>]+>', ' ', html)
                except Exception:
                    pass
    else:
        try:
            body = msg.get_payload(decode=True).decode('utf-8', errors='replace')
        except Exception:
            pass
    return body

def parse_jobs_from_email(subject, body, sender, date_str):
    jobs = []
    urls = extract_urls_from_text(body)

    source = 'Email Alert'
    if 'linkedin' in sender:
        source = 'LinkedIn'
    elif 'indeed' in sender:
        source = 'Indeed'
    elif 'wellfound' in sender:
        source = 'Wellfound'
    elif 'greenhouse' in sender:
        source = 'Greenhouse'
    elif 'lever' in sender:
        source = 'Lever'
    elif 'remotive' in sender:
        source = 'Remotive'

    lines = [l.strip() for l in body.split('\n') if l.strip()]

    if not urls:
        return jobs

    for i, url in enumerate(urls[:20]):
        title = ''
        company = ''
        location = ''

        for line in lines:
            if len(line) > 5 and len(line) < 100:
                if not title and not any(c in line for c in ['http', '@', 'unsubscribe', 'view all']):
                    title = line
                elif title and not company:
                    company = line
                    break

        jobs.append({
            'title': title or subject,
            'company': company,
            'location': location,
            'url': url,
            'source': source,
            'posted_date': date_str,
        })

    return jobs

def main():
    if len(sys.argv) < 3:
        print(json.dumps([]))
        sys.exit(0)

    gmail_address = sys.argv[1]
    app_password = sys.argv[2]
    days_back = int(sys.argv[3]) if len(sys.argv) > 3 else 2

    since_date = (datetime.now() - timedelta(days=days_back)).strftime("%d-%b-%Y")

    try:
        mail = imaplib.IMAP4_SSL('imap.gmail.com')
        mail.login(gmail_address, app_password)
        mail.select('inbox')
    except Exception as e:
        sys.stderr.write(f"Gmail connection failed: {e}\n")
        print(json.dumps([]))
        sys.exit(0)

    all_jobs = []

    for sender in ALERT_SENDERS:
        try:
            _, nums = mail.search(None, f'(FROM "{sender}" SINCE {since_date})')
            if not nums[0]:
                continue
            for num in nums[0].split():
                try:
                    _, data = mail.fetch(num, '(RFC822)')
                    msg = email.message_from_bytes(data[0][1])
                    subject = decode_header_value(msg.get('Subject', ''))
                    date_str = msg.get('Date', '')
                    body = get_text_from_message(msg)
                    jobs = parse_jobs_from_email(subject, body, sender, date_str)
                    all_jobs.extend(jobs)
                except Exception:
                    continue
        except Exception:
            continue

    mail.logout()
    print(json.dumps(all_jobs, ensure_ascii=False, indent=2))

if __name__ == '__main__':
    main()
