from app.models.risk import RedFlagType

def identify_red_flags(signals: dict):
    flags = []
    if not signals.get("mrz_ok", True):
        flags.append({"type": RedFlagType.DOCUMENT_INVALID_FORMAT, "severity": "HIGH", "confidence": 0.9, "desc": "MRZ format error"})
    if signals.get("tampering", False):
        flags.append({"type": RedFlagType.POSSIBLE_TAMPERING, "severity": "CRITICAL", "confidence": 0.9, "desc": "Tampering detected"})
    return flags
