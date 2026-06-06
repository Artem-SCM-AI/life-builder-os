from bot import is_instruction


def test_short_message_is_instruction():
    assert is_instruction("make it shorter") is True


def test_imperative_verb_is_instruction():
    assert is_instruction("remove the supply chain mention and make the tone rawer") is True


def test_ukrainian_imperative_is_instruction():
    assert is_instruction("зроби коротше і прибери згадку про Supply Chain") is True


def test_long_post_text_is_replacement():
    long_post = (
        "I quit drugs at 27.\n"
        "On my own. No clinic. No program.\n"
        "Just a decision made in a kitchen in Dnipro.\n"
        "Nine years behind bars across the CIS.\n"
        "That chapter ended the moment I chose it to."
    )
    assert is_instruction(long_post) is False


def test_medium_text_without_imperatives_is_replacement():
    text = "The AI wave is not coming. It already arrived. Most professionals missed it because they were waiting for permission."
    assert is_instruction(text) is False
