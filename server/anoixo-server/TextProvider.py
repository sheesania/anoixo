import abc


class TextProvider(abc.ABC):
    @abc.abstractmethod
    def get_provided_text_name(self) -> str:
        pass

    @abc.abstractmethod
    def get_source_name(self) -> str:
        pass
