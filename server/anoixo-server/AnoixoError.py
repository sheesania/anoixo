import abc


class AnoixoError(Exception, abc.ABC):
    def __init__(self, message):
        self.message = message

    @abc.abstractmethod
    def get_friendly_error_message(self) -> str:
        pass


class ProbableBugError(AnoixoError):
    def get_friendly_error_message(self) -> str:
        return 'It looks like there\'s a bug in the app. Please let us know you had this problem so we can fix it!'


class ServerOverwhelmedError(AnoixoError):
    def get_friendly_error_message(self) -> str:
        return 'It looks like the server is currently overwhelmed. Try your search again later.'