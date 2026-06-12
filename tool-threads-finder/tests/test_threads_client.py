import pytest
from unittest.mock import patch, Mock
from threads_client import ThreadsClient, ThreadsAPIError, ThreadsAuthError

TOKEN = 'test-token'

def make_client():
    return ThreadsClient(TOKEN)

def test_search_returns_posts(requests_mock):
    requests_mock.get(
        'https://graph.threads.net/v1.0/threads/keyword_search',
        json={'data': [
            {'id': 'p1', 'text': 'обробляю інвойси вручну щодня', 'timestamp': '2026-06-12T10:00:00Z', 'username': 'user1'},
        ]}
    )
    client = make_client()
    posts = client.search('обробляю інвойси вручну')
    assert len(posts) == 1
    assert posts[0]['id'] == 'p1'

def test_search_returns_empty_on_no_results(requests_mock):
    requests_mock.get(
        'https://graph.threads.net/v1.0/threads/keyword_search',
        json={'data': []}
    )
    posts = make_client().search('xyz')
    assert posts == []

def test_search_raises_on_401(requests_mock):
    requests_mock.get(
        'https://graph.threads.net/v1.0/threads/keyword_search',
        status_code=401, json={}
    )
    with pytest.raises(ThreadsAuthError):
        make_client().search('keyword')

def test_search_raises_on_api_error(requests_mock):
    requests_mock.get(
        'https://graph.threads.net/v1.0/threads/keyword_search',
        status_code=500, text='error'
    )
    with pytest.raises(ThreadsAPIError):
        make_client().search('keyword')

def test_reply_returns_id(requests_mock):
    requests_mock.post('https://graph.threads.net/v1.0/me/threads', json={'id': 'container1'})
    requests_mock.post('https://graph.threads.net/v1.0/me/threads_publish', json={'id': 'reply1'})
    with patch('threads_client.time.sleep'):
        result = make_client().reply('post1', 'Відповідь тут')
    assert result == 'reply1'

def test_get_replies_returns_list(requests_mock):
    requests_mock.get(
        'https://graph.threads.net/v1.0/our_reply_123/replies',
        json={'data': [
            {'id': 'c1', 'text': 'Цікаво, розкажіть більше', 'username': 'user2', 'timestamp': '2026-06-12T11:00:00Z'}
        ]}
    )
    replies = make_client().get_replies('our_reply_123')
    assert len(replies) == 1
    assert replies[0]['id'] == 'c1'
